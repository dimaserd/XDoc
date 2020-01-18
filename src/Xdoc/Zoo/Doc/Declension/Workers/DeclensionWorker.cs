using System.Collections.Generic;
using System.Linq;
using Zoo.Doc.Declension.Enumerations;
using Zoo.Doc.Declension.Models;

namespace Zoo.Doc.Declension.Workers
{
    public static class HumanDeclensionWorker
    {
        private static List<HumanWithFullNameDeclension> _humansWithDeclensions;

        private static List<HumanWithFullNameDeclension> HumanWithDeclensions => _humansWithDeclensions ?? (_humansWithDeclensions = new List<HumanWithFullNameDeclension>());

        private static FullNameDeclension GetFullNameDeclensionByHuman(HumanModel human)
        {
            var declensionInMemory = HumanWithDeclensions.FirstOrDefault(x =>
                x.Human.FirstName == human.FirstName && x.Human.LastName == human.LastName &&
                x.Human.Patronymic == human.Patronymic);

            if (declensionInMemory != null)
            {
                return declensionInMemory.Declension;
            }

            declensionInMemory = new HumanWithFullNameDeclension
            {
                Human = human
            };

            HumanWithDeclensions.Add(declensionInMemory);

            return GetFullNameDeclensionByHuman(human);
        }

        /// <summary>
        /// Склонение имени человека
        /// </summary>
        /// <param name="human"></param>
        /// <param name="wordCase"></param>
        /// <returns></returns>
        public static string NameDeclension(HumanModel human, WordCase wordCase)
        {
            var fullNameDecl = GetFullNameDeclensionByHuman(human);

            return fullNameDecl.FirstName.GetByWordCase(wordCase);
        }

        /// <summary>
        /// Склонение фамилии человека
        /// </summary>
        /// <param name="human"></param>
        /// <param name="wordCase"></param>
        /// <returns></returns>
        public static string LastNameDeclension(HumanModel human, WordCase wordCase)
        {
            var fullNameDecl = GetFullNameDeclensionByHuman(human);

            return fullNameDecl.LastName.GetByWordCase(wordCase);
        }

        /// <summary>
        /// Склонение Отчества человека
        /// </summary>
        /// <param name="human"></param>
        /// <param name="wordCase"></param>
        /// <returns></returns>
        public static string PatronymicDeclension(HumanModel human, WordCase wordCase)
        {
            var fullNameDecl = GetFullNameDeclensionByHuman(human);

            return fullNameDecl.Patronymic.GetByWordCase(wordCase);
        }
    }
}