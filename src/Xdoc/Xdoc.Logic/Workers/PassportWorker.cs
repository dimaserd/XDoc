using Croco.Core.Abstractions.ContextWrappers;
using Croco.Core.Common.Models;
using Croco.Core.Logic.Workers;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Xdoc.Logic.Models;
using Xdoc.Model.Entities;
using Xdoc.Model.Enumerations;

namespace Xdoc.Logic.Workers
{
    public class PassportWorker : BaseCrocoWorker
    {
        public PassportWorker(IUserRequestWithRepositoryFactory context) : base(context)
        {
        }

        /// <summary>
        /// Создать или обновить паспорт клиента
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<BaseApiResponse> CreateOrUpdateClientPassport(RussianFederationPassportModel model)
        {
            if(!IsAuthenticated)
            {
                return new BaseApiResponse(false, "Вы не авторизованы");
            }

            var validation = ValidateModel(model);

            if(!validation.IsSucceeded)
            {
                return validation;
            }

            var repo = GetRepository<ClientDocument>();

            var clientId = UserId;

            var oldPassport = await repo.Query()
                .FirstOrDefaultAsync(x => x.ClientId == clientId && x.Type == ClientDocumentType.RussianFederationPassport);

            if(oldPassport != null)
            {
                repo.UpdateHandled(oldPassport);
            }

            var doc = model.ToPassportClientDocument(clientId);

            repo.CreateHandled(doc);

            return await TrySaveChangesAndReturnResultAsync("Паспорт добавлен успешно");
        }
    }
}
