using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Xdoc.Logic.Workers;
using Xdoc.Model.Contexts;
using Xdoc.Model.Entities.Users.Default;

namespace Clt.Logic.Workers.Users
{
    public class UserWorker : XDocBaseWorker
    {
        public async Task<BaseApiResponse> CheckUserNameAndPasswordAsync(string userId, string userName, string pass)
        {
            var userRepo = ContextWrapper.GetRepository<ApplicationUser>();

            var user = await userRepo.Query()
                .FirstOrDefaultAsync(x => x.Id == userId);

            var passHasher = new PasswordHasher<ApplicationUser>();

            var t = passHasher.VerifyHashedPassword(user, user.PasswordHash, pass) != PasswordVerificationResult.Failed && user.UserName == userName;

            return new BaseApiResponse(t, "");
        }

        public UserWorker(IUserContextWrapper<XdocDbContext> contextWrapper) : base(contextWrapper)
        {
        }
    }
}
