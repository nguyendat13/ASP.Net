using Microsoft.AspNetCore.Mvc;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model;
using PhatDat_TH2.Model.DTO;

[Route("api/[controller]")]
[ApiController]
public class BannerController : ControllerBase
{
    private readonly AppDbContext _context;

    public BannerController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetBanners() => Ok(_context.Banners.ToList());

    [HttpGet("{id}")]
    public IActionResult GetBanner(int id)
    {
        var banner = _context.Banners.Find(id);
        if (banner == null) return NotFound();
        return Ok(banner);
    }


    [HttpPost]
    public async Task<IActionResult> Create([FromForm] BannerCreateDTO bannerDto)
    {
        if (bannerDto.ImageFile != null && bannerDto.ImageFile.Length > 0)
        {
            var fileName = Path.GetFileName(bannerDto.ImageFile.FileName);
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/banners", fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await bannerDto.ImageFile.CopyToAsync(stream);
            }

            var banner = new Banner
            {
                ImageUrl = $"/images/banners/{fileName}",
                Link = bannerDto.Link
            };

            _context.Banners.Add(banner);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBanner), new { id = banner.Id }, banner);
        }

        return BadRequest("No file uploaded.");
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBanner(int id, [FromForm] BannerCreateDTO bannerDTO)
    {
        // Tìm banner cần cập nhật
        var banner = await _context.Banners.FindAsync(id);
        if (banner == null)
        {
            return NotFound("Banner không tồn tại.");
        }

        // Nếu có ảnh mới, xử lý việc lưu ảnh
        if (bannerDTO.ImageFile != null)
        {
            // Lưu ảnh vào thư mục (ví dụ: wwwroot/images)
            var fileName = Path.GetFileName(bannerDTO.ImageFile.FileName);
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/banners", fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await bannerDTO.ImageFile.CopyToAsync(stream);  // Lưu ảnh vào hệ thống
            }

            // Cập nhật URL ảnh trong banner
            banner.ImageUrl = "/images/banners" + fileName;
        }

        // Cập nhật link
        banner.Link = bannerDTO.Link;

        // Lưu thay đổi vào cơ sở dữ liệu
        _context.Banners.Update(banner);
        await _context.SaveChangesAsync();

        return Ok(banner);  // Trả về banner đã được cập nhật
    }


    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var banner = _context.Banners.Find(id);
        if (banner == null) return NotFound();

        _context.Banners.Remove(banner);
        _context.SaveChanges();
        return NoContent();
    }
}
