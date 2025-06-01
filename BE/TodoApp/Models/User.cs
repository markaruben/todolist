using System.ComponentModel.DataAnnotations;

namespace TodoApp.Models
{
    public class User
    {
        public int Id { get; set; }


        [MaxLength(255)]
        public required string Username { get; set; }

        [Required]
        public string Password { get; set; } = string.Empty;

        public ICollection<TodoItem> TodoItems { get; set; } = new List<TodoItem>();
    }
}
