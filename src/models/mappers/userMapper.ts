import { SafeUserWithRole, UserRoleType } from '../types';
import { IUserDTO } from '../dtos/auth';
import { IPaginatedData } from '../dtos/paged';

/**
 * 🔹 Maps a SafeUserWithRole to a DTO for API responses.
 */
export function mapUserToDTO(user: SafeUserWithRole): IUserDTO {
	return {
		userId: user.id,
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		createdAt: user.createdAt,
		role: (user.userType ?? 'User') as UserRoleType,
		cntCheckedVAT: user.cntCheckedVAT ?? 0,
	};
}

/**
 * 🔹 Maps a paginated list of SafeUserWithRole to IUserDTO.
 */
export function mapPaginatedUsersToDTO(
	paginatedUsers: IPaginatedData<SafeUserWithRole>
): IPaginatedData<IUserDTO> {
	return {
		...paginatedUsers,
		items: paginatedUsers.items.map(mapUserToDTO),
	};
}
