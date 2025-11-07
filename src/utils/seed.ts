import { CommonUtils } from "./common";
import { AppSettings } from "./config";
import Logger from "./logger";
import { prisma } from "./prisma";

export async function seedInitialData() {
	console.log("seeder");
	Logger.info("🔄 Starting initial seeding...");

	// -------------------------
	// 1. Seed Super Admin
	// -------------------------
	const { firstName, lastName, email, password } = AppSettings.superAdmin;

	if (!email || !password) {
		Logger.warn("⚠️ Super admin email or password not set in .env");
		return;
	}
	console.log(password);
	const passwordHash = await CommonUtils.hashPassword(password);

	const existingUser = await prisma.user.findUnique({ where: { email } });

	if (!existingUser) {
		await prisma.user.create({
			data: {
				firstName,
				lastName,
				email,
				passwordHash,
				emailVerified: true,
				userType: "Admin",
				isActive: true,
				createdAt: new Date(),
			},
		});
		Logger.info(`👑 Super admin created: ${email}`);
	} else if (existingUser.userType !== "Admin") {
		await prisma.user.update({
			where: { email },
			data: { userType: "Admin" },
		});
		Logger.info(`🔧 Updated ${email} to Admin role`);
	} else {
		Logger.info(`✅ Super admin already exists: ${email}`);
	}

	// -------------------------
	// 2. Gem Types
	// -------------------------
	Logger.info("💎 Seeding Gem Types...");

	const gemTypes = [
		"Any", "Alexandrite", "Amethyst", "Ametrine", "Aquamarine", "Citrine",
		"Diamond", "Emerald", "Fancy Diamond", "Garnet", "Iolite", "Jade",
		"Kunzite", "Lapis Lazuli", "Moonstone", "Morganite", "Opal", "Pearl",
		"Peridot", "Rose Quartz", "Ruby", "Sapphire", "Spinel", "Sunstone",
		"Tanzanite", "Topaz", "Tourmaline", "Turquoise", "Zircon",
	];

	for (const name of gemTypes) {
		const exists = await prisma.gemType.findFirst({ where: { name } });
		if (!exists) await prisma.gemType.create({ data: { name } });
	}

	// -------------------------
	// 3. Gem Shapes
	// -------------------------
	Logger.info("💠 Seeding Gem Shapes...");

	const shapes = [
		"Any", "Round", "Oval", "Pear", "Square", "Heart", "Marquise", "Cushion",
		"Emerald Cut", "Radiant", "Asscher", "Princess", "Baguette", "Tapered Baguette",
		"Square Emerald Cut", "Square Radiant", "Cushion Brilliant", "Cushion Modified",
		"Antique Cushion", "Octagonal", "Hexagonal", "Pentagonal", "Trapezoid",
		"Triangular", "Trillion", "Half Moon", "Shield", "Kite", "Lozenge", "Star",
		"Sugarloaf", "Briolette", "Carved", "European Cut", "Old Miner", "Bullets",
		"Tapered Bullet", "Calf", "Circular Brilliant", "Epaulette", "Flanders", "Sphere",
		"Fancy", "Custom", "Near Round", "Button", "Drop", "Baroque Drop", "Baroque",
		"Semi-Baroque", "Circle", "Keshi", "Mabe",
	];

	for (const name of shapes) {
		const exists = await prisma.shape.findFirst({ where: { name } });
		if (!exists) await prisma.shape.create({ data: { name } });
	}

	// -------------------------
	// 4. Colors
	// -------------------------
	Logger.info("🌈 Seeding Colors...");

	const colors = [
		"Any", "Colorless", "White", "Black", "Gray", "Brown", "Yellow",
		"Orange", "Red", "Pink", "Purple", "Blue", "Blue/Green", "Green",
		"Bicolor", "Color Change", "Multicolor", "Golden", "Bronze",
		"Lavender", "Silver", "Cream",
	];

	await prisma.color.createMany({
		data: colors.map(name => ({ name })),
		skipDuplicates: true,
	});

	// -------------------------
	// 5. Clarity
	// -------------------------
	Logger.info("🔍 Seeding Clarity Levels...");

	const clarities = [
		"Any", "Loupe clean", "Eye clean", "Slightly included", "Moderately included",
		"Highly included", "FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "SI3", "I1", "I2", "I3",
	];

	await prisma.clarity.createMany({
		data: clarities.map(name => ({ name })),
		skipDuplicates: true,
	});

	// -------------------------
	// 6. Cut & Polish
	// -------------------------
	Logger.info("✂️ Seeding Cut & Polish...");

	const cutPolish = ["Any", "Excellent", "Very Good", "Good", "Poor", "3X", "EX-", "VG+", "VG-"];

	await prisma.cutPolish.createMany({
		data: cutPolish.map(name => ({ name })),
		skipDuplicates: true,
	});

	// -------------------------
	// 7. Saturation
	// -------------------------
	Logger.info("🎨 Seeding Saturation...");

	const saturations = [
		"Any", "Faint", "Very Light", "Light", "Moderate", "Intense", "Vivid", "Deep", "Dark",
	];

	await prisma.saturation.createMany({
		data: saturations.map(name => ({ name })),
		skipDuplicates: true,
	});

	// -------------------------
	// 8. Treatment
	// -------------------------
	Logger.info("🧪 Seeding Treatments...");

	const treatments = [
		"Any", "None", "Heat", "Oil insignificant", "Oil minor", "Oil moderate",
		"Oil significant", "Resin insignificant", "Resin minor", "Resin moderate", "Resin significant",
		"Diffusion", "Diffusion (Be)", "Diffusion (Ti)", "Diffusion (Cr)", "Irradiation", "HPHT",
		"Glass filled", "Impregnation", "Coating", "Dyeing", "Colored oil", "Laser drilled", "Yehuda",
		"Carbonizing", "Acid and Sugar", "Smoke", "Stabilized", "Reconstituted", "Waxing", "Bleaching",
		"Filling", "Maeshori",
	];

	await prisma.treatment.createMany({
		data: treatments.map(name => ({ name })),
		skipDuplicates: true,
	});

	// -------------------------
	// 9. Cutting Style
	// -------------------------
	Logger.info("💎 Seeding Cutting Styles...");

	const cuttingStyles = [
		"Any", "Brilliant", "Step", "Mixed", "Portuguese", "Fancy", "Rose Cut", "Cabochon",
		"Checkerboard", "Concave", "Bead", "Polished Bead", "Faceted Bead",
	];

	await prisma.cuttingStyle.createMany({
		data: cuttingStyles.map(name => ({ name })),
		skipDuplicates: true,
	});

	// -------------------------
	// 10. Effect, Transparency, Texture, Fluorescence
	// -------------------------
	await prisma.effect.createMany({
		data: ["Any", "None", "Cat’s Eye", "Star", "Trapiche", "Adularescence", "Aventurescence"]
			.map(name => ({ name })),
		skipDuplicates: true,
	});

	await prisma.transparency.createMany({
		data: ["Any", "Transparent", "Translucent", "Opaque"].map(name => ({ name })),
		skipDuplicates: true,
	});

	await prisma.texture.createMany({
		data: ["Any", "Clean", "Blurry", "Milky", "Silky", "Gota de Aceite"].map(name => ({ name })),
		skipDuplicates: true,
	});

	await prisma.fluorescence.createMany({
		data: ["Any", "None", "Very Slight", "Faint / Slight", "Medium", "Strong", "Very Strong"]
			.map(name => ({ name })),
		skipDuplicates: true,
	});

	// -------------------------
	// 11. Origin
	// -------------------------
	Logger.info("🌍 Seeding Origins...");

	const origins = [
		"Any", "Afghanistan", "Angola", "Australia", "Bolivia", "Botswana", "Brazil", "Burma (Myanmar)",
		"Cambodia", "Canada", "Central African Republic", "Ceylon (Sri Lanka)", "Chile", "China",
		"Cook Islands", "Colombia", "Czech Republic", "Democratic Republic of the Congo", "Egypt",
		"Ethiopia", "Fiji", "Ghana", "Guinea", "Hawaii", "Himalaya", "Honduras", "India", "Indonesia",
		"Iran", "Japan", "Kazakhstan", "Kenya", "Laos", "Lesotho", "Liberia", "Madagascar", "Malawi",
		"Mali", "Mexico", "Micronesia", "Morocco", "Mozambique", "Namibia", "Nigeria", "Norway",
		"Pakistan", "Panjshir", "Peru", "Philippines", "Russia", "Sierra Leone", "Slovakia", "Somalia",
		"South Africa", "Swat Valley", "Tajikistan", "Tahiti", "Tanzania", "Thailand", "Tibet", "Tonga",
		"Turkey", "United States", "Uruguay", "Uzbekistan", "Vietnam", "Zambia", "Zimbabwe",
	];

	await prisma.origin.createMany({
		data: origins.map(name => ({ name })),
		skipDuplicates: true,
	});

	// -------------------------
	// 12. Appellation
	// -------------------------
	Logger.info("🏷️ Seeding Appellations...");

	const appellations = [
		"Any", "None", "Pigeon Blood", "Royal", "Crimson", "Royal Blue", "Cornflower", "Velvet",
		"Padparadscha", "Teal", "Peacock", "Twilight", "Kashmer", "Mekong", "Hot Pink", "Jedi",
		"Cobalt", "Neon", "Paraiba", "Lagoon", "Mint", "Chrome", "Rubellite", "Watermelon", "Indicolite",
		"Verdelite", "Salt and Pepper", "Black", "Champagne", "Chocolate", "Cognac", "Chameleon", "Argyle",
		"Jadeite", "Nephrite", "Imperial", "Dragon", "Spessartite", "Rhodolite", "Mandarin", "Tsavorite",
		"Hessonite", "Demantoid", "Malaya", "Mali", "Umbalite", "Fanta", "Almandine", "Santa Maria",
		"Rose de France", "Muzo Green", "Mariposa", "Boulder", "Crystal", "Fire", "Conch", "Melo",
		"Keshi", "Akoya", "South Sea", "Tahitian", "Freshwater", "Mabe", "Sky Blue", "Swiss Blue",
		"London Blue", "Double Blue", "Madeira", "Golden", "Bahia", "Matrix", "Welo", "Hydrophane",
		"Common", "Natural", "Cultured", "Rainbow", "Oregon", "D Block", "Mystic", "Persian Blue",
		"Sleeping Beauty", "Kingman", "Bisbee", "Candelaria", "Number 8", "Cerrillos", "Royston",
		"Carico", "Honey", "Hyacinth", "Starlite", "Matara", "Cortez", "Abalone", "Blister", "Other", "IIa",
	];

	await prisma.appellation.createMany({
		data: appellations.map(name => ({ name })),
		skipDuplicates: true,
	});

	// -------------------------
	// 13. Country, BuyType, LabReport
	// -------------------------
	Logger.info("🌐 Seeding Countries, Buy Types & Lab Reports...");

	const countries = [
		'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia',
		'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
		'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde',
		'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo',
		'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti',
		'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini',
		'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala',
		'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
		'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia',
		'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia',
		'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco',
		'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand',
		'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama',
		'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
		'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
		'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
		'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland',
		'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia',
		'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
		'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe', 'Other'
	];
	await prisma.country.createMany({
		data: countries.map(name => ({ name })),
		skipDuplicates: true,
	});

	await prisma.buyType.createMany({
		data: ["Any", "My country", "My continent"].map(name => ({ name })),
		skipDuplicates: true,
	});

	await prisma.labReport.createMany({
		data: [
			"Any", "None", "GIA", "HRD", "IGI", "AGS", "CGL", "AGL", "AGTA",
			"AIGS", "GRS", "Gubelin", "LOTUS", "SSEF", "BELLEROPHON", "GIT", "Other",
		].map(name => ({ name })),
		skipDuplicates: true,
	});

	Logger.info("✅ Seeding complete!");
}
