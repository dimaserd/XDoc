using Croco.Core.Implementations.AmbientContext;
using Croco.Core.Implementations.TransactionHandlers;
using System.Collections.Generic;
using Zoo.GenericUserInterface.Models;

namespace Xdoc.Api.InterfaceOverriders
{
    /// <summary>
    /// Расширения для переопределений пользовательского интерфейса
    /// </summary>
    public class GenericInterfaceOverriderExtensions
    {
        /// <summary>
        /// Получить системный хендлер для транзакции
        /// </summary>
        /// <returns></returns>
        public static CrocoTransactionHandler GetTransactionHandler() => new CrocoTransactionHandler(() => new SystemCrocoAmbientContext());

        /// <summary>
        /// Добавить опцию 'Не выбрано' в начало списка
        /// </summary>
        /// <param name="list"></param>
        /// <param name="notSelectedText"></param>
        public static void AddNotSelectedToStartOfTheList(List<MySelectListItem> list, string notSelectedText = "Не выбрано")
        {
            list.Insert(0, new MySelectListItem
            {
                Selected = true,
                Text = notSelectedText,
                Value = null
            });
        }
    }
}