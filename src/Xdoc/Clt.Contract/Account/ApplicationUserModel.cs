using System;
using System.Linq.Expressions;
using Xdoc.Model.Entities.Users.Default;

namespace Clt.Contract.Account
{
    public class ApplicationUserModel
    {
        public string Id { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public static Expression<Func<ApplicationUser, ApplicationUserModel>> SelectExpression = x => new ApplicationUserModel
        {
            Id = x.Id,
            Email = x.Email,
            PhoneNumber = x.PhoneNumber
        };
    }
}
