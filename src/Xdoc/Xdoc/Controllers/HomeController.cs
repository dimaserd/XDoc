using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xdoc.Logic.Services;
using Xdoc.Model.Contexts;

namespace Xdoc.Controllers
{
    public class HomeController : BaseController
    {
        public HomeController(XdocDbContext context, ApplicationUserManager userManager, ApplicationSignInManager signInManager, IHttpContextAccessor httpContextAccessor) : base(context, userManager, signInManager, httpContextAccessor)
        {
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}