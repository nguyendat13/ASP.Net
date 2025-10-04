using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PhatDat_TH2.Model.DTO;
using PhatDat_TH2.Services.IServices;
using System.Threading.Tasks;

namespace PhatDat_TH2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin")]
    public class ActivityLogController : ControllerBase
    {
        private readonly IActivityLogService _logService;

        public ActivityLogController(IActivityLogService logService)
        {
            _logService = logService;
        }

        // Lấy danh sách log có phân trang & filter
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] ActivityLogQuery query)
        {
            var result = await _logService.GetLogsAsync(query);
            return Ok(result);
        }

        // Lấy log theo Id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _logService.GetLogsAsync(new ActivityLogQuery
            {
                Page = 1,
                PageSize = 25
            });

            var log = result.Items.FirstOrDefault(x => x.Id == id);
            if (log == null)
                return NotFound(new { message = "Không tìm thấy log" });

            return Ok(log);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLog(int id)
        {
            await _logService.DeleteLogAsync(id);
            return NoContent();
        }

        [HttpDelete("all")]
        public async Task<IActionResult> DeleteAllLogs()
        {
            await _logService.DeleteAllLogsAsync();
            return NoContent();
        }
    }
}
