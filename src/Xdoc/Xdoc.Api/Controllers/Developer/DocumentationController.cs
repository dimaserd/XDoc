using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Croco.Core.Application;
using Croco.Core.Documentation.Models;
using Croco.Core.Documentation.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xdoc.Api;
using Xdoc.Api.Controllers.Base;
using Xdoc.Logic.Services;
using Xdoc.Model.Contexts;
using Zoo;
using Zoo.GenericUserInterface.Models;
using Zoo.GenericUserInterface.Services;

namespace CrocoShop.Api.Controllers.Api.Developer
{
    /// <inheritdoc />
    /// <summary>
    /// Предоставляет автогенерируемую документацию
    /// </summary>
    [Route("Api/Documentation")]
    public class DocumentationController : BaseApiController
    {
        /// <inheritdoc />
        public DocumentationController(XdocDbContext context, ApplicationSignInManager signInManager, ApplicationUserManager userManager, IHttpContextAccessor httpContextAccessor) : base(context, signInManager, userManager, httpContextAccessor)
        {
        }


        /// <summary>
        /// Получить документацию по типу в проекте
        /// </summary>
        /// <returns></returns>
        [HttpPost("Type"), ProducesDefaultResponseType(typeof(CrocoTypeDescription))]
        public CrocoTypeDescription GetTypeDocumentation(string typeName)
        {
            if (typeName == null)
            {
                return null;
            }

            var type = CrocoTypeSearcher.FindFirstTypeByName(typeName);

            if(type == null)
            {
                return null;
            }

            return CrocoTypeDescription.GetDescription(type);
        }

        /// <summary>
        /// Получить документацию по перечислению в проекте
        /// </summary>
        /// <returns></returns>
        [HttpPost("EnumType"), ProducesDefaultResponseType(typeof(List<CrocoEnumTypeDescription>))]
        public CrocoEnumTypeDescription GetEnumTypeDocumentation(string typeName)
        {
            var typeDoc = GetTypeDocumentation(typeName);

            if(typeDoc == null)
            {
                return null;
            }

            if(!typeDoc.IsEnumeration)
            {
                return null;
            }

            return typeDoc.EnumDescription;
        }

        /// <summary>
        /// Получить модель для построения обобщенного интерфейса
        /// </summary>
        /// <param name="typeName"></param>
        /// <param name="modelPrefix"></param>
        /// <returns></returns>
        [HttpPost("GenericInterface"), ProducesDefaultResponseType(typeof(CrocoTypeDescription))]
        public GenerateGenericUserInterfaceModel GetGenericInterfaceModel(string typeName, string modelPrefix)
        {
            return Optimizations.GetValue($"GenericInterface.{typeName}.{modelPrefix}", () => GetGenericInterfaceModelTask(typeName, modelPrefix), CrocoApp.Application.CacheManager);
        }

        private static Task<GenerateGenericUserInterfaceModel> GetGenericInterfaceModelTask(string typeName, string modelPrefix)
        {
            var type = CrocoTypeSearcher.FindFirstTypeByName(typeName);

            if (type == null)
            {
                return Task.FromResult((GenerateGenericUserInterfaceModel)null);
            }

            return GetModelByType(type, modelPrefix, true);
        }

        private static async Task<GenerateGenericUserInterfaceModel> GetModelByType(Type type, string modelPrefix, bool useOverridings)
        {
            var result = new GenericUserInterfaceModelBuilder(type, modelPrefix).Result;

            if (!useOverridings)
            {
                return result;
            }

            await result.OverrideAsync(ApiMapOverridings.GetOverridings());

            return result;
        }
    }
}