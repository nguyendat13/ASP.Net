using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhatDat_TH2.Data;
using PhatDat_TH2.Model;

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
            var posts = _context.Posts.Include(p => p.Topic).ToList();
            return Ok(posts);
        }

        [HttpGet("{id}")]
        public IActionResult GetPost(int id)
        {
            var post = _context.Posts.Include(p => p.Topic).FirstOrDefault(p => p.Id == id);
            if (post == null) return NotFound();
            return Ok(post);
        }

        [HttpPost]
        public IActionResult Create(Post post)
        {
            _context.Posts.Add(post);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetPost), new { id = post.Id }, post);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Post updated)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            post.Title = updated.Title;
            post.Content = updated.Content;
            post.PublishedDate = updated.PublishedDate;
            post.TopicId = updated.TopicId;

            _context.SaveChanges();
            return Ok(post);
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
