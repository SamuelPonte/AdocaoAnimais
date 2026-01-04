using AdocaoAnimais_v1.Models.api;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AdocaoAnimais_v1.Controllers.api
{
    /// <summary>
    /// API de autenticação e gestão de sessão (Identity).
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AutenticacaoApiController : ControllerBase
    {
        
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
    
        /// <summary>
        /// Inicializa o controller com os serviços do Identity.
        /// </summary>
        public AutenticacaoApiController(
            UserManager<IdentityUser> userManager, 
            SignInManager<IdentityUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }
        
        // POST: api/AutenticacaoApi/register
        /// <summary>
        /// Regista um novo utilizador e inicia sessão automaticamente.
        /// </summary>
        /// <param name="loginModel">Credenciais (username/email e password).</param>
        /// <returns>200 em sucesso, ou erro de validação.</returns>
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] LoginApiModel loginModel)
        {
            if (string.IsNullOrWhiteSpace(loginModel.Username) || string.IsNullOrWhiteSpace(loginModel.Password))
                return BadRequest("Dados inválidos");

            var user = new IdentityUser
            {
                UserName = loginModel.Username,
                Email = loginModel.Username
            };

            var result = await _userManager.CreateAsync(user, loginModel.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            // login automático após registo
            await _signInManager.SignInAsync(user, isPersistent: true);

            return Ok();

        }
        
        // GET: api/AutenticacaoApi/whoami
        /// <summary>
        /// Devolve a identificação do utilizador autenticado (se existir).
        /// </summary>
        /// <returns>Objeto com o username/email autenticado.</returns>
        [HttpGet]
        [Route("whoami")]
        public ActionResult WhoAmi()
        {
            return User.Identity.IsAuthenticated ?
                Ok(new WhoAmI() { User= User.Identity.Name}) 
                : 
                Ok(new WhoAmI(){ User=""});
        }

        // POST: api/AutenticacaoApi/login
        /// <summary>
        /// Inicia sessão com email e password.
        /// </summary>
        /// <param name="loginModel">Credenciais do utilizador.</param>
        /// <returns>200 em sucesso, 401 se inválido.</returns>
        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> Login([FromBody] LoginApiModel loginModel)
        {
            if (loginModel == null || 
                (string.IsNullOrEmpty(loginModel.Username) || string.IsNullOrEmpty(loginModel.Password))) { 
                return BadRequest("Request inválido");
            }

            // Procura o utilizador pelo emailr
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
        
        // POST: api/AutenticacaoApi/logout
        /// <summary>
        /// Termina a sessão do utilizador autenticado.
        /// </summary>
        /// <returns>200 em sucesso.</returns>
        [HttpPost]
        [Route("logout")]
        public async Task<ActionResult> LogOut()
        {
            await _signInManager.SignOutAsync();

            return Ok();
        }
    }
}
