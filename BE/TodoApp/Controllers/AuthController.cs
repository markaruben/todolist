using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TodoApp.Models;
using TodoApp.Data;
using Microsoft.AspNetCore.Identity;
using TodoApp.DTOs;

namespace TodoApp.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AuthController : ControllerBase
  {
    private readonly TodoContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(TodoContext context, IConfiguration configuration)
    {
      _context = context;
      _configuration = configuration;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] UserRegisterDto userDto)
    {
      if (_context.Users.Any(u => u.Username == userDto.Username))
        return BadRequest("User already exists");

      var user = new User
      {
        Username = userDto.Username
      };

      var passwordHasher = new PasswordHasher<User>();
      user.Password = passwordHasher.HashPassword(user, userDto.Password);

      _context.Users.Add(user);
      _context.SaveChanges();

      return Ok("User registered");
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] UserRegisterDto loginDto)
    {
      var user = _context.Users.FirstOrDefault(u => u.Username == loginDto.Username);

      if (user == null)
        return Unauthorized("Invalid username or password");

      var passwordHasher = new PasswordHasher<User>();
      var result = passwordHasher.VerifyHashedPassword(user, user.Password, loginDto.Password);

      if (result != PasswordVerificationResult.Success)
        return Unauthorized("Invalid username or password");

      var tokenHandler = new JwtSecurityTokenHandler();
      var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? throw new Exception("JWT key missing"));

      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(new Claim[]
          {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
          }),
        Expires = DateTime.UtcNow.AddHours(1),
        Audience = "TodoAppUsers",
        Issuer = "TodoApp",
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
      };

      var token = tokenHandler.CreateToken(tokenDescriptor);
      var tokenString = tokenHandler.WriteToken(token);

      return Ok(new { Token = tokenString });
    }
  }
}
