using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Croco.Core.Application;
using Croco.Core.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Xdoc.Logic.Extensions;
using Xdoc.Model.Entities;
using Xdoc.Model.Entities.Users.Default;

namespace Xdoc.Logic.Services
{

    public class ApplicationUserManager : UserManager<ApplicationUser>
    {
        public ApplicationUserManager(IUserStore<ApplicationUser> store, IOptions<IdentityOptions> optionsAccessor, IPasswordHasher<ApplicationUser> passwordHasher, IEnumerable<IUserValidator<ApplicationUser>> userValidators, IEnumerable<IPasswordValidator<ApplicationUser>> passwordValidators, ILookupNormalizer keyNormalizer, IdentityErrorDescriber errors, IServiceProvider services, ILogger<UserManager<ApplicationUser>> logger) : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
        {
        }

        public Task<Client> GetClientAsync(ClaimsPrincipal claimsPrincipal)
        {
            if (!claimsPrincipal.Identity.IsAuthenticated)
            {
                return Task.FromResult<Client>(null);
            }

            var userId = claimsPrincipal.GetUserId();

            return CrocoApp.Application.GetDatabaseContext(SystemCrocoExtensions.GetRequestContext())
                .Query<Client>().FirstOrDefaultAsync(x => x.Id == userId);
        }

        public ApplicationUser GetCachedUser(ClaimsPrincipal claimsPrincipal)
        {
            if (!claimsPrincipal.Identity.IsAuthenticated)
            {
                return null;
            }

            var userId = claimsPrincipal.GetUserId();

            return Users.FirstOrDefault(x => x.Id == userId);
        }
    }
}