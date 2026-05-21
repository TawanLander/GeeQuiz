select * from usuario;

select * from quiz;

select * from quizes_completos;

select * from acertos;

select * from perguntas;

select * from opcoes;

select * from token;

select * from gostei;

select * 
    from quiz
        join perguntas
            on quiz.idQuiz = perguntas.fkQuiz
        join opcoes
            on quiz.idQuiz = opcoes.fkQuiz;