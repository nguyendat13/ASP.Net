using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model;
using PhatDat_TH2.Model.DTO;

namespace PhatDat_TH2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PostController(AppDbContext context)
        {
            _context = context;
        }

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

        [HttpPost]
        public IActionResult Create([FromForm] PostCreateDTO dto, IFormFile imageFile)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            string imageUrl = null;

            if (imageFile != null && imageFile.Length > 0)
            {
                // Thư mục lưu ảnh: wwwroot/images/posts
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "posts");
                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                // Đặt tên file duy nhất
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    imageFile.CopyTo(stream);
                }

                // Lưu URL tương đối (để FE dùng hiển thị)
                imageUrl = "/images/posts/" + fileName;
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
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetPost), new { id = post.Id }, new PostDTO
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                PublishedDate = post.PublishedDate,
                TopicId = post.TopicId,
                TopicName = _context.Topics.Find(post.TopicId)?.Title,
                ImageUrl = post.ImageUrl
            });
        }


        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromForm] PostUpdateDTO dto, IFormFile? imageFile)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            post.Title = dto.Title;
            post.Content = dto.Content;
            post.TopicId = dto.TopicId;

            // Nếu có upload ảnh mới thì lưu lại file
            if (imageFile != null && imageFile.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/posts");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    imageFile.CopyTo(stream);
                }

                // Cập nhật đường dẫn ảnh
                post.ImageUrl = "/images/posts/" + uniqueFileName;
            }

            _context.SaveChanges();

            return Ok(new PostDTO
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                PublishedDate = post.PublishedDate,
                TopicId = post.TopicId,
                TopicName = _context.Topics.Find(post.TopicId)?.Title,
                ImageUrl = post.ImageUrl
            });
        }

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


        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            _context.Posts.Remove(post);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
