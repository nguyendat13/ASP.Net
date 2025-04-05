using Microsoft.AspNetCore.Mvc;

namespace PhatDat_TH2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Index()
        {
            return Ok(new { message = "Welcome to PhatDat API!" });
        }
    }
}
