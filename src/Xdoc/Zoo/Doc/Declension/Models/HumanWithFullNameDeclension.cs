using System;

namespace Zoo.Doc.Declension.Models
{
    public class HumanWithFullNameDeclension
    {
        private FullNameDeclension _declension;

        public HumanModel Human { get; set; }

        public FullNameDeclension Declension
        {
            get
            {
                if (_declension != null)
                {
                    return _declension;
                }

                if (Human == null)
                {
                    throw new NullReferenceException($"Пустое свойство {nameof(Human)}");
                }

                _declension = FullNameDeclension.GetByHumanModel(Human);

                return _declension;
            }
        }
    }
}