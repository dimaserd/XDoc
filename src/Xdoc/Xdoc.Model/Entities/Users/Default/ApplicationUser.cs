using FocLab.Model.Entities.Users.Default;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Xdoc.Model.Entities.Users.Default
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit https://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    [Table(nameof(ApplicationUser))]
    public class ApplicationUser : WebApplicationUser
    {
        public ICollection<ApplicationUserRole> Roles { get; set; }
    }
}