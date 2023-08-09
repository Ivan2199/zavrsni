const {
  QuizResult,
  Answer,
  AnswerOption,
  Question,
  Quiz,
} = require("../models");

const { serializeQuizResult } = require("../schemas/quizResult");

module.exports = {
  async createQuizResult(req, res) {
    const { userId, score, quizId, status, startTime, endTime, answers } =
      req.body;
    const quizResult = await QuizResult.create(
      {
        userId,
        quizId,
        startTime,
        endTime,
        status,
        score,
      },
      {
        include: [
          {
            model: AnswerOption,
            include: {
              model: Question,
            },
          },
          {
            model: Quiz,
            include: {
              model: Question,
              include: {
                model: AnswerOption,
              },
            },
          },
        ],
      }
    );
    answers.map(async (answer) => {
      const answerDB = await Answer.create({
        quizResultId: quizResult.id,
        answerOptionId: answer.id,
      });
      return answerDB;
    });
    await quizResult.reload();
    return res.status(201).json(serializeQuizResult(quizResult));
  },
  async getQuizResults(req, res) {
    const quizResults = await QuizResult.findAll({
      include: [
        {
          model: AnswerOption,
          include: {
            model: Question,
          },
        },
        {
          model: Quiz,
          include: {
            model: Question,
            include: {
              model: AnswerOption,
            },
          },
        },
      ],
    });
    return res.status(200).json(quizResults);
  },
};
