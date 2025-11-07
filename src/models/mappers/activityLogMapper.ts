import { IActivityLogDTO } from '../dtos/activityLog';
import { IPaginatedData } from '../dtos/paged';
import { ActivityLogWithSafeUser } from '../types';
import { mapUserToDTO } from './userMapper';

export function mapActivityLogToDTO(log: ActivityLogWithSafeUser): IActivityLogDTO {
	return {
		id: log.id,
		level: log.level,
		data: log.data,
		createdAt: log.createdAt,
		userId: log.userId!,
		user: mapUserToDTO(log.user!),
	};
}

export function mapPaginatedActivityLogsToDTO(
	paginatedLogs: IPaginatedData<ActivityLogWithSafeUser>
): IPaginatedData<IActivityLogDTO> {
	return {
		...paginatedLogs,
		items: paginatedLogs.items.map(mapActivityLogToDTO),
	};
}
