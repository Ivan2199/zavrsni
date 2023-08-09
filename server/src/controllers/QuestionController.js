const { Question, AnswerOption } = require("../models");
const {
  serializeQuestion,
  serializeQuestionList,
} = require("../schemas/question");

const {
  createQuestion,
  fetchQuestion,
  fetchAllQuestions,
} = require("../services/QuestionService");

const allowedCategories = {
  PropisiuCestovnomPrometu: "PropisiuCestovnomPrometu",
  CestaiNjenaObiljezja: "CestaiNjenaObiljezja",
  PonasanjeSudionikauPrometu: "PonasanjeSudionikauPrometu",
  OstaliSudioniciuPrometu: "OstaliSudioniciuPrometu",
  ZnakoviuPrometu: "ZnakoviuPrometu",
  UocavanjePrometnihUvjetaiSituacija: "UocavanjePrometnihUvjetaiSituacija",
  PrometnaPravila: "PrometnaPravila",
  VozilouFunkcijiSigurnostiPrometa: "VozilouFunkcijiSigurnostiPrometa",
  VoznjauNaselju: "VoznjauNaselju",
  VoznjaIzvanNaselja: "VoznjaIzvanNaselja",
  PostupakuSlucajuPrometneNesrece: "PostupakuSlucajuPrometneNesrece",
  VoznjauPosebnimUvjetima: "VoznjauPosebnimUvjetima",
  PrvaPomoc: "PrvaPomoc",
};

module.exports = {
  async addQuestion(req, res) {
    const {
      id,
      imageUrl,
      scoreWorth,
      correctAnswers,
      text,
      videoUrl,
      category,
      answers,
    } = req.body;

    const categoryExists = Object.values(allowedCategories).find(
      (c) => c == category
    );
    if (!categoryExists) {
      return res
        .status(400)
        .json({ message: `You have sent a non-allowed category: ${category}` });
    }
    const question = await createQuestion(
      {
        id,
        imageUrl,
        scoreWorth,
        text,
        correctAnswers,
        videoUrl,
        category,
        answers,
      },
      { include: AnswerOption }
    );

    return res.status(201).json(serializeQuestion(question));
  },
  async getQuestion(req, res) {
    const { id } = req.params;
    const question = await fetchQuestion(id, { include: AnswerOption });
    if (!question) {
      return res
        .status(404)
        .json({ message: `Question by ID ${id} not found` });
    }

    return res.status(200).json(serializeQuestion(question));
  },
  async getQuestions(req, res) {
    const { category } = req.query;
    const queryParams = {
      include: [AnswerOption],
      order: [[AnswerOption, "id", "ASC"]],
    };
    if (category) {
      queryParams.where = {
        category: category,
      };
    }
    const questions = await fetchAllQuestions(queryParams);

    return res.status(200).json(serializeQuestionList(questions));
  },
  async deleteQuestion(req, res) {
    const { id } = req.params;
    const question = await Question.findByPk(id);
    if (!question) {
      return res
        .status(404)
        .json({ message: `Question by ID ${id} not found` });
    }
    await question.destroy();
    return res.status(200).json({ message: "question successfully deleted" });
  },
};
