using Clt.Logic.Abstractions;
using FocLab.Model.Entities.Users.Default;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace Clt.Logic.Implementations
{
    public class ApplicationAuthenticationManager : IApplicationAuthenticationManager
    {
        private readonly SignInManager<ApplicationUser> _signInManager;

        public ApplicationAuthenticationManager(SignInManager<ApplicationUser> signInManager)
        {
            _signInManager = signInManager;
        }

        public void SignOut()
        {
            SignOutAsync().GetAwaiter().GetResult();
        }

        public Task SignOutAsync()
        {
            return _signInManager.SignOutAsync();
        }
    }
}
