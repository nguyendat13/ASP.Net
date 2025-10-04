using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model;
using PhatDat_TH2.Model.DTO;
using PhatDat_TH2.Services.IServices;

namespace PhatDat_TH2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ICloudinaryService _cloudinaryService;
        private readonly IWebHostEnvironment _env;

        public PostController(AppDbContext context, ICloudinaryService cloudinaryService, IWebHostEnvironment env)
        {
            _context = context;
            _cloudinaryService = cloudinaryService;
            _env = env;
        }

        // 🟢 Lấy tất cả bài viết
        [HttpGet]
        public IActionResult GetPosts()
        {
            var posts = _context.Posts
                .Include(p => p.Topic)
                .Select(p => new PostDTO
                {
                    Id = p.Id,
                    Title = p.Title,
                    Content = p.Content,
                    PublishedDate = p.PublishedDate,
                    TopicId = p.TopicId,
                    TopicName = p.Topic != null ? p.Topic.Title : "Không có chủ đề",
                    ImageUrl = p.ImageUrl
                })
                .ToList();

            return Ok(posts);
        }

        // 🟢 Lấy bài viết theo ID
        [HttpGet("{id}")]
        public IActionResult GetPost(int id)
        {
            var post = _context.Posts
                .Include(p => p.Topic)
                .Where(p => p.Id == id)
                .Select(p => new PostDTO
                {
                    Id = p.Id,
                    Title = p.Title,
                    Content = p.Content,
                    PublishedDate = p.PublishedDate,
                    TopicId = p.TopicId,
                    TopicName = p.Topic.Title,
                    ImageUrl = p.ImageUrl
                })
                .FirstOrDefault();

            if (post == null) return NotFound();

            return Ok(post);
        }

        // 🟢 Tạo bài viết mới (có Cloudinary)
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] PostCreateDTO dto, IFormFile? imageFile, [FromQuery] bool useCloudinary = false)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            string? imageUrl = null;

            if (imageFile != null)
            {
                if (useCloudinary)
                {
                    imageUrl = await _cloudinaryService.UploadImageAsync(imageFile);
                }
                else
                {
                    imageUrl = await SaveLocalImage(imageFile);
                }
            }

            var post = new Post
            {
                Title = dto.Title,
                Content = dto.Content,
                TopicId = dto.TopicId,
                PublishedDate = dto.PublishedDate,
                ImageUrl = imageUrl
            };

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            var topic = await _context.Topics.FindAsync(post.TopicId);

            return CreatedAtAction(nameof(GetPost), new { id = post.Id }, new PostDTO
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                PublishedDate = post.PublishedDate,
                TopicId = post.TopicId,
                TopicName = topic?.Title,
                ImageUrl = post.ImageUrl
            });
        }

        // 🟢 Cập nhật bài viết (có Cloudinary)
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] PostUpdateDTO dto, IFormFile? imageFile, [FromQuery] bool useCloudinary = false)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();

            post.Title = dto.Title;
            post.Content = dto.Content;
            post.TopicId = dto.TopicId;

            if (imageFile != null)
            {
                post.ImageUrl = useCloudinary
                    ? await _cloudinaryService.UploadImageAsync(imageFile)
                    : await SaveLocalImage(imageFile);
            }

            await _context.SaveChangesAsync();

            var topic = await _context.Topics.FindAsync(post.TopicId);

            return Ok(new PostDTO
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                PublishedDate = post.PublishedDate,
                TopicId = post.TopicId,
                TopicName = topic?.Title,
                ImageUrl = post.ImageUrl
            });
        }

        // 🟢 Lấy 3 bài viết mới nhất
        [HttpGet("latest")]
        public IActionResult GetLatestPosts()
        {
            var latestPosts = _context.Posts
                .Include(p => p.Topic)
                .OrderByDescending(p => p.PublishedDate)
                .Take(3)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    Excerpt = p.Content.Length > 100 ? p.Content.Substring(0, 100) + "..." : p.Content,
                    p.PublishedDate,
                    ImageUrl = p.ImageUrl ?? "/assets/post/default.png"
                })
                .ToList();

            return Ok(latestPosts);
        }

        // 🟢 Xóa bài viết
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ✅ Hàm lưu ảnh cục bộ
        private async Task<string> SaveLocalImage(IFormFile imageFile)
        {
            var folderPath = Path.Combine(_env.WebRootPath, "images", "posts");
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
            var filePath = Path.Combine(folderPath, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await imageFile.CopyToAsync(stream);

            return "/images/posts/" + fileName;
        }
    }
}
