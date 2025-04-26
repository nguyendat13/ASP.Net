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

        // Lấy tất cả bài viết sử dụng DTO
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
                    TopicName = p.Topic != null ? p.Topic.Title : "Không có chủ đề"
                })

                .ToList();

            return Ok(posts);
        }

        // Lấy bài viết theo ID sử dụng DTO
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
                    TopicName = p.Topic.Title  // Ánh xạ tên topic
                })
                .FirstOrDefault();

            if (post == null)
                return NotFound();

            return Ok(post);
        }

        [HttpPost]
        public IActionResult Create(PostDTO postDto)
        {
            var post = new Post
            {
                Title = postDto.Title,
                Content = postDto.Content,
                TopicId = postDto.TopicId,
                PublishedDate = DateTime.UtcNow // hoặc bạn có thể để null nếu không cần
            };

            _context.Posts.Add(post);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetPost), new { id = post.Id }, post);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, PostDTO updatedDto)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            post.Title = updatedDto.Title;
            post.Content = updatedDto.Content;
            post.TopicId = updatedDto.TopicId;

            _context.SaveChanges();

            return Ok(post);
        }
        // Thêm vào PostController.cs
        [HttpGet("latest")]
        public IActionResult GetLatestPosts()
        {
            var latestPosts = _context.Posts
                .Include(p => p.Topic)
                .OrderByDescending(p => p.PublishedDate)
                .Take(3) // lấy 3 bài viết mới nhất (có thể điều chỉnh)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    Excerpt = p.Content.Length > 100 ? p.Content.Substring(0, 100) + "..." : p.Content,
                    p.PublishedDate,
                    ImageUrl = "/assets/post/default.png" // Hoặc link ảnh thực nếu có
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
