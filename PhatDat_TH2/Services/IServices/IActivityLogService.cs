using PhatDat_TH2.Model;
using PhatDat_TH2.Model.DTO;

namespace PhatDat_TH2.Services.IServices
{
    public interface IActivityLogService
    {
        Task<ActivityLog> LogAsync(
         int? userId,
         string action,
         string entityType,
         int? entityId = null,
         object details = null,
         string ip = null,
         string userAgent = null);

        Task<PaginatedResult<ActivityLog>> GetLogsAsync(ActivityLogQuery query);
        Task DeleteLogAsync(int id);
        Task DeleteAllLogsAsync();
    }
}
