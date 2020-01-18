using Clt.Contract.Events;
using Clt.Logic.Models;
using Clt.Logic.Models.Account;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Xdoc.Logic.Workers;
using Xdoc.Model.Contexts;
using Xdoc.Model.Entities;
using Xdoc.Model.Entities.Users.Default;

namespace Clt.Logic.Workers.Accounts
{

    public class AccountRegistrationWorker : XDocBaseWorker
    {
        public AccountRegistrationWorker(IUserContextWrapper<XdocDbContext> contextWrapper) : base(contextWrapper)
        {
        }


        private ApplicationUser RegisteredUser { get; set; }

        public async Task<BaseApiResponse<ClientModel>> RegisterAndSignInAsync(RegisterModel model, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            var result = await RegisterAsync(model, userManager);

            if (!result.IsSucceeded)
            {
                return result;
            }

            //авторизация пользователя в системе
            await signInManager.SignInAsync(RegisteredUser, false);

            return new BaseApiResponse<ClientModel>(true, "Регистрация и Авторизация прошла успешно", result.ResponseObject);
        }

        public async Task<BaseApiResponse<ClientModel>> RegisterAsync(RegisterModel model, UserManager<ApplicationUser> userManager)
        {

            if (IsAuthenticated)
            {
                return new BaseApiResponse<ClientModel>(false, "Вы не можете регистрироваться, так как вы авторизованы в системе");
            }

            var result = await RegisterHelpMethodAsync(model, userManager);

            if (!result.IsSucceeded)
            {
                return new BaseApiResponse<ClientModel>(result);
            }

            var regResult = result.ResponseObject;

            RegisteredUser = regResult.User;

            Application.EventPublisher.Publish(new ClientRegisteredEvent
            {
                ClientId = regResult.Client.Id
            });

            return new BaseApiResponse<ClientModel>(true, "Регистрация прошла успешно.", ClientModel.ToClientModel(regResult.Client));
        }

        private async Task<BaseApiResponse<ClientRegisteredResult>> RegisterHelpMethodAsync(RegisterModel model, UserManager<ApplicationUser> userManager)
        {
            var user = new ApplicationUser
            {
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                UserName = model.Email
            };

            var checkResult = await CheckUserAsync(user);

            if (!checkResult.IsSucceeded)
            {
                return new BaseApiResponse<ClientRegisteredResult>(checkResult);
            }

            var result = await userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return new BaseApiResponse<ClientRegisteredResult>(false, result.Errors.First().Description);
            }

            var client = new Client
            {
                Id = user.Id,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber
            };

            var clientRepo = GetRepository<Client>();

            clientRepo.CreateHandled(client);

            return await TrySaveChangesAndReturnResultAsync("Ok", new ClientRegisteredResult
            {
                Client = client,
                User = user
            });
        }

        private async Task<BaseApiResponse> CheckUserAsync(ApplicationUser user)
        {
            if (string.IsNullOrWhiteSpace(user.Email))
            {
                return new BaseApiResponse(false, "Вы не указали адрес электронной почты");
            }

            if (string.IsNullOrWhiteSpace(user.PhoneNumber))
            {
                return new BaseApiResponse(false, "Вы не указали номер телефона");
            }

            var userRepo = GetRepository<ApplicationUser>();

            if (await userRepo.Query().AnyAsync(x => x.Email == user.Email))
            {
                return new BaseApiResponse(false, "Пользователь с данным email адресом уже существует");
            }

            if (await userRepo.Query().AnyAsync(x => x.PhoneNumber == user.PhoneNumber))
            {
                return new BaseApiResponse(false, "Пользователь с данным номером телефона уже существует");
            }

            return new BaseApiResponse(true, "");
        }
    }
}
