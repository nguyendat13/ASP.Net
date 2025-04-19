using Microsoft.AspNetCore.Mvc;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model;
using System.Collections.Generic;
using System.Linq;

namespace PhatDat_TH2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MethodController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MethodController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Method
        [HttpGet]
        public ActionResult<IEnumerable<Method>> GetMethods()
        {
            var methods = _context.Methods.ToList();
            return Ok(methods);
        }
    }
}
