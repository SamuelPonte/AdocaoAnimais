using AdocaoAnimais_v1.Models.api;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AdocaoAnimais_v1.Controllers.api
{
    [Route("api/[controller]")]
    [ApiController]
    public class AutenticacaoApiController : ControllerBase
    {
        
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;

        public AutenticacaoApiController(
            UserManager<IdentityUser> userManager, 
            SignInManager<IdentityUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }
        
        public record AuthDto(string Username, string Password);

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] AuthDto dto)
        {
            var user = new IdentityUser { UserName = dto.Username, Email = dto.Username };
            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            // opcional: login automático após registo
            await _signInManager.SignInAsync(user, isPersistent: true);

            return Ok();
        }

        [HttpGet]
        [Route("whoami")]
        public ActionResult WhoAmi()
        {
            return User.Identity.IsAuthenticated ?
                Ok(new WhoAmI() { User= User.Identity.Name}) 
                : 
                Ok(new WhoAmI(){ User=""});
        }


        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> Login([FromBody] LoginApiModel loginModel)
        {
            if (loginModel == null || 
                (string.IsNullOrEmpty(loginModel.Username) || string.IsNullOrEmpty(loginModel.Password))) { 
                return BadRequest("Request inválido");
            }

            // ir buscar o user
            var identity = await _userManager.FindByEmailAsync(loginModel.Username);
            if (identity == null)
            {
                return BadRequest("User não existe");
            }

            var res = await _signInManager.PasswordSignInAsync(identity, loginModel.Password, true, false);
            if (res.Succeeded) {
                return Ok();
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpGet]
        [Route("logout")]
        public async Task<ActionResult> LogOut()
        {
            await _signInManager.SignOutAsync();

            return Ok();
        }
    }
}
