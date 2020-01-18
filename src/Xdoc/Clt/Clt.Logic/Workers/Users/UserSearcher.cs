using Clt.Contract.Account;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Xdoc.Logic.Workers;
using Xdoc.Model.Contexts;
using Xdoc.Model.Entities.Users.Default;

namespace Clt.Logic.Workers.Users
{
    /// <summary>
    /// Класс предоставляющий методы для поиска пользователей
    /// </summary>
    public class UserSearcher : XDocBaseWorker
    {
        

        #region Методы получения одного пользователя


        public Task<ApplicationUserModel> GetUserByPhoneNumberAsync(string phoneNumber)
        {
            return GetUserByPredicateExpression(x => x.PhoneNumber == phoneNumber);
        }

        public Task<ApplicationUserModel> GetUserByIdAsync(string userId)
        {
            return GetUserByPredicateExpression(x => x.Id == userId);
        }


        public Task<ApplicationUserModel> GetUserByEmailAsync(string email)
        {
            return GetUserByPredicateExpression(x => x.Email == email);
        }

        private Task<ApplicationUserModel> GetUserByPredicateExpression(Expression<Func<ApplicationUserModel, bool>> predicate)
        {
            var usersRepo = GetRepository<ApplicationUser>();

            return usersRepo.Query()
                .Select(ApplicationUserModel.SelectExpression)
                .FirstOrDefaultAsync(predicate);
        }

        #endregion

        
        public UserSearcher(IUserContextWrapper<XdocDbContext> contextWrapper) : base(contextWrapper)
        {
        }
    }
}
