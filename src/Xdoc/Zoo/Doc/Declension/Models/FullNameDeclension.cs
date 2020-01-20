using System;
using System.Xml;
using Croco.Core.Models;
using RestSharp;

namespace Zoo.Doc.Declension.Models
{
    public class FullNameDeclension
    {
        public static BaseApiResponse<FullNameDeclension> GetByHumanModel(HumanModel human)
        {
            if (human == null)
            {
                throw new ArgumentNullException(nameof(human));
            }

            var name = $"{human.FirstName} {human.LastName} {human.Patronymic}";

            var client = new RestClient("https://ws3.morpher.ru");

            var request = new RestRequest("russian/declension", Method.GET);

            request.AddParameter("s", name); // adds to POST or URL querystring based on Method

            IRestResponse response = client.Execute(request);

            if(response.StatusCode != System.Net.HttpStatusCode.OK)
            {
                return new BaseApiResponse<FullNameDeclension>(false, "Удаленный сервер не вернул данные");
            }

            var content = response.Content; // raw content as string

            var xml = new XmlDocument();

            xml.LoadXml(content);

            var declension = new FullNameDeclension(human, xml);

            return new BaseApiResponse<FullNameDeclension>(true, "Ok", declension);
        }

        public FullNameDeclension(HumanModel human, XmlNode xml)
        {
            var xmlNode = xml.ChildNodes[1];

            var a1 = xmlNode.SelectSingleNode("Р").InnerText.Split(new[] { " " }, StringSplitOptions.None);

            var a2 = xmlNode.SelectSingleNode("Д").InnerText.Split(new[] { " " }, StringSplitOptions.None);

            var a3 = xmlNode.SelectSingleNode("В").InnerText.Split(new[] { " " }, StringSplitOptions.None);

            var a4 = xmlNode.SelectSingleNode("Т").InnerText.Split(new[] { " " }, StringSplitOptions.None);

            var a5 = xmlNode.SelectSingleNode("П").InnerText.Split(new[] { " " }, StringSplitOptions.None);

            FirstName = new Declension
            {
                И = human.FirstName,
                Р = a1[0],
                Д = a2[0],
                В = a3[0],
                Т = a4[0],
                П = a5[0],
            };

            LastName = new Declension
            {
                И = human.LastName,
                Р = a1[1],
                Д = a2[1],
                В = a3[1],
                Т = a4[1],
                П = a5[1],
            };

            Patronymic = new Declension
            {
                И = human.Patronymic,
                Р = a1[2],
                Д = a2[2],
                В = a3[2],
                Т = a4[2],
                П = a5[2],
            };
        }

        public Declension FirstName { get; set; }

        public Declension LastName { get; set; }

        public Declension Patronymic { get; set; }
    }
}