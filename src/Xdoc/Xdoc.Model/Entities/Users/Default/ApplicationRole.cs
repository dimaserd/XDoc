using System.Collections.Generic;
using FocLab.Model.Entities.Users.Default;
using Microsoft.AspNetCore.Identity;

namespace Xdoc.Model.Entities.Users.Default
{
    public class ApplicationRole : IdentityRole
    {
        public ICollection<ApplicationUserRole> UserRoles { get; set; }
    }
}
