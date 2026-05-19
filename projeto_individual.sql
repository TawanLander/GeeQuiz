create database site;

use site;
show tables;
select count(genero) from usuario group by genero;


show columns from usuario;

alter table quiz rename column avaliacao to gostados;

select * from perguntas;

select * from opcoes;

describe opcoes;

create table usuario(
idUsuario int primary key auto_increment,
nome varchar(60) not null,
email varchar(60) not null,
identidade varchar(20) not null,
dtNascimento date not null,
senha varchar(30) not null,
cargo char(1) not null
);

use site;
select * from quizes_completos;
select * from acertos;
select * from usuario;
select * from token;

truncate table token;

describe token;

insert into token (token, fkUsuario) values ('abc', 1);

insert into usuario values(default, 'GeeQuiz', 'tlander2007@gmail.com', 'Masculino', '2007-04-02', 'Admin123#', 'a');
insert into usuario values (default, 'Tawan Lander', 'tlander2007@gmail.com', 'Masculino', '2007-04-02', 'SenhaFortona12#', 'p');
insert into usuario values (default, 'Tawan Lander', 'sim@sim.com', 'Feminino', '2007-04-02', 'SenhaFortona15#', 0, 'a');
insert into usuario values (default, 'Tawan Lander', 'teste@teste.com', 'Prefiro Não Dizer', '2007-04-02', 'SenhaFortona14#', 0, 'a');
insert into usuario values (default, 'Tawan Lander', 'email@email.com', 'Outro', '2007-04-02', 'SenhaFortona13#', 0, 'a');
delete from usuario where id = 0;
select * from usuario;

create table quiz(
idQuiz int primary key auto_increment,
titulo varchar(60) not null,
genero varchar(20) not null,
tipo varchar(20) not null,
imagem varchar(500),
gostados int,
fkUsuario int,
constraint fkUsuario_quiz foreign key (fkUsuario) references usuario(idUsuario) on delete cascade
);

alter table quiz modify column gostados int;
alter table quiz rename column img to imagem;

create table quizes_completos(
id int auto_increment,
dthr datetime default now(),
fkUsuario int,
fkQuiz int,
constraint pkTripla_quizes_completos primary key (id, fkUsuario, fkQuiz),
constraint fkUsuario_quizes_completos foreign key (fkUsuario) references usuario(idUsuario) on delete cascade,
constraint fkQuiz_quizes_completos foreign key (fkQuiz) references quiz(idQuiz) on delete cascade
);

create table acertos(
fkQuizesCompletos int,
fkUsuario int,
fkQuiz int,
fkPerguntas int,
fkOpcoes int,
selecionado tinyint,
constraint pkQuintupla_acertos primary key (fkQuizesCompletos, fkUsuario, fkQuiz, fkPerguntas, fkOpcoes),
constraint fkQuizesCompletos_acertos foreign key (fkQuizesCompletos, fkUsuario, fkQuiz) references quizes_completos(id, fkUsuario, fkQuiz) on delete cascade,
constraint fkPerguntas_acertos foreign key (fkOpcoes, fkPerguntas) references opcoes(id, fkPerguntas) on delete cascade
);

create table perguntas(
id int,
fkQuiz int,
constraint pkDupla_perguntas primary key (id, fkQuiz),
constraint fkQuiz_perguntas foreign key (fkQuiz) references quiz(idQuiz) on delete cascade,
titulo varchar(60) not null,
imagem varchar(500) not null,
tipo char(1) not null
);

alter table perguntas modify column titulo varchar(60);

insert into perguntas (id, fkQuiz, nome) values
(1, 3, 'Você Gosta de Preto?'),
(2, 3, 'Você Gosta de Branco?'),
(3, 3, 'Você Gosta de Rosa?');

create table opcoes(
id int,
fkPerguntas int,
fkQuiz int,
constraint pkTripla_opcoes primary key (id, fkPerguntas, fkQuiz),
constraint fkPerguntas_opcoes foreign key (fkPerguntas, fkQuiz) references perguntas(id, fkQuiz) on delete cascade,
titulo varchar(100),
tipo TINYINT
);

insert into opcoes (id, fkPerguntas, fkQuiz, nome) values 
(1, 1, 3, 'Sim'),
(1, 2, 3, 'Não'),
(2, 1, 3, 'Se fuder'),
(3, 1, 3, 'ABC'),
(2, 2, 3, 'DEC');

select * from usuario;
select * from opcoes;
select * from quiz;
select * from acertos;

select quizes_completos.dthr as data, acertos.fkQuizesCompletos as tentativa, acertos.fkPerguntas as pergunta, acertos.fkOpcoes as opcao, acertos.selecionado as selecionado, opcoes.tipo as tipo 
    from acertos 
      join opcoes 
        on acertos.fkOpcoes = opcoes.id 
      join quizes_completos
        on quizes_completos.id = acertos.fkQuizesCompletos
    where acertos.fkQuiz = 4
      and acertos.fkUsuario = 3
    group by quizes_completos.dthr, acertos.fkQuizesCompletos, acertos.fkQuizesCompletos, acertos.fkPerguntas, acertos.fkOpcoes, acertos.selecionado, opcoes.tipo
    order by acertos.fkQuizesCompletos, acertos.fkOpcoes;

alter table quiz auto_increment = 0;
insert into quiz (fkUsuario, titulo, tipo, genero, imagem) values 
(4, 'Você ama mais HunterXHunter do que a Iasmin?', 'Conhecimento Geral', 'Anime', 'https://imgs.search.brave.com/NKktO8yCXQMplrZ8vJUWMPTJHw0M2-gzLVZW1vUDEl4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMwLmNicmltYWdl/cy5jb20vd29yZHBy/ZXNzL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIzLzEwL2dvbi1r/aWxsdWEtbGVvcmlv/LWFuZC1rdXJhcGlr/YS1vbi1odW50ZXIt/ZXhhbS1hcmMuanBn/P3E9NDkmZml0PWNy/b3Amdz0zNjAmaD0y/NDAmZHByPTI');

update quiz set idQuiz = 1 where idQuiz = 3;

insert into perguntas (id, fkQuiz, titulo, imagem, tipo) values 
(1, 1, 'Qual o tipo de NEN do Killua e Gon?', 'https://imgs.search.brave.com/kVThxUfQPLxf2i3cXH97v_8P4g0HjapOeJvJpR8Y3dQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMuYmVlYm9tLmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAy/My8wNi9UZW4uanBn/P3c9NjQw', 'n'),
(2, 1, 'Que tipo de vilão o Hisoka é?', 'https://imgs.search.brave.com/hODwGctnnHkfBiGsdFG2RwLuY-eXkGRMidGXRdvf3g0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMwLmdhbWVyYW50/aW1hZ2VzLmNvbS93/b3JkcHJlc3Mvd3At/Y29udGVudC91cGxv/YWRzLzIwMjEvMTEv/SHVudGVyLVgtSHVu/dGVyLS0tUGhhbnRv/bS1Ucm91cGUtTWVt/YmVyLUhpc29rYS1N/YXJyb3ctSW4tSGlz/LVByaW1lLUdvaW5n/LUluLUZvci1UaGUt/S2lsbC5qcGc_cT01/MCZmaXQ9Y3JvcCZ3/PTgyNSZkcHI9MS41', 'n'),
(3, 1, 'Quais personagens vieram do continente negro?', 'https://imgs.search.brave.com/so3lMdvTf7uXS6MFzxmPutLvNFd7eaei3CCYeMku_hA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly8yaW1n/Lm5ldC9oL29pNjUu/dGlueXBpYy5jb20v/ZG4weWdnLnBuZw', 'n');

insert into opcoes (id, fkQuiz, fkPerguntas, titulo) values 
(1, 1, 1, 'Fortificador e Fortificador'),
(2, 1, 1, 'Especialista e Especialista'),
(3, 1, 1, 'Transmutador e Fortificador'),
(4, 1, 1, 'Manipulação e Emissão'),
(1, 1, 2, 'Monstro'),
(2, 1, 2, 'Manipulador'),
(3, 1, 2, 'Trágico'),
(4, 1, 2, 'Fanático'),
(1, 1, 3, 'Formiga Quimera, Aluka, Don Freecss'),
(2, 1, 3, 'Formiga Quimera, Gon, Brion'),
(3, 1, 3, 'As 5 calamidades, Aluka, Kurapika'),
(4, 1, 3, 'As 5 calamidades, Formiga Quimera, Don Freecss');


-- Quiz 1: Geografia
INSERT INTO quiz (titulo, genero, tipo, imagem, gostados, fkUsuario) VALUES
('Capitais do Mundo', 'Geografia', 'multipla_escolha', 'geografia.jpg', 0, 1);

INSERT INTO perguntas (id, fkQuiz, titulo, imagem, tipo) VALUES
(1, 1, 'Qual é a capital da França?', 'franca.jpg', 'M'),
(2, 1, 'Qual é a capital do Japão?', 'japao.jpg', 'M'),
(3, 1, 'Qual é a capital da Australia?', 'australia.jpg', 'M');

INSERT INTO opcoes (id, fkPerguntas, fkQuiz, titulo, tipo) VALUES
(1, 1, 1, 'Paris', 1),
(2, 1, 1, 'Londres', 0),
(3, 1, 1, 'Berlim', 0),
(4, 1, 1, 'Roma', 0),
(1, 2, 1, 'Osaka', 0),
(2, 2, 1, 'Tóquio', 1),
(3, 2, 1, 'Hiroshima', 0),
(4, 2, 1, 'Kyoto', 0),
(1, 3, 1, 'Sydney', 0),
(2, 3, 1, 'Melbourne', 0),
(3, 3, 1, 'Camberra', 1),
(4, 3, 1, 'Brisbane', 0);

-- Quiz 2: Filmes
INSERT INTO quiz (titulo, genero, tipo, imagem, gostados, fkUsuario) VALUES
('Cinema Clássico', 'Entretenimento', 'multipla_escolha', 'cinema.jpg', 0, 1);

INSERT INTO perguntas (id, fkQuiz, titulo, imagem, tipo) VALUES
(1, 3, 'Em que ano foi lançado Titanic?', 'titanic.jpg', 'M'),
(2, 3, 'Quem dirigiu Pulp Fiction?', 'pulpfiction.jpg', 'M'),
(3, 3, 'Qual ator interpreta o Coringa em 2019?', 'coringa.jpg', 'M');

INSERT INTO opcoes (id, fkPerguntas, fkQuiz, titulo, tipo) VALUES
(1, 1, 3, '1995', 0),
(2, 1, 3, '1997', 1),
(3, 1, 3, '1999', 0),
(4, 1, 3, '2001', 0),
(1, 2, 3, 'Steven Spielberg', 0),
(2, 2, 3, 'Martin Scorsese', 0),
(3, 2, 3, 'Quentin Tarantino', 1),
(4, 2, 3, 'Christopher Nolan', 0),
(1, 3, 3, 'Christian Bale', 0),
(2, 3, 3, 'Heath Ledger', 0),
(3, 3, 3, 'Joaquin Phoenix', 1),
(4, 3, 3, 'Jack Nicholson', 0);

-- Quiz 3: Tecnologia
INSERT INTO quiz (titulo, genero, tipo, imagem, gostados, fkUsuario) VALUES
('Mundo da Tecnologia', 'Tecnologia', 'multipla_escolha', 'tecnologia.jpg', 0, 1);

INSERT INTO perguntas (id, fkQuiz, titulo, imagem, tipo) VALUES
(1, 4, 'Quem fundou a Microsoft?', 'microsoft.jpg', 'M'),
(2, 4, 'Em que ano o iPhone foi lançado?', 'iphone.jpg', 'M'),
(3, 4, 'O que significa a sigla HTTP?', 'http.jpg', 'M');

INSERT INTO opcoes (id, fkPerguntas, fkQuiz, titulo, tipo) VALUES
(1, 1, 4, 'Steve Jobs', 0),
(2, 1, 4, 'Bill Gates', 1),
(3, 1, 4, 'Elon Musk', 0),
(4, 1, 4, 'Mark Zuckerberg', 0),
(1, 2, 4, '2005', 0),
(2, 2, 4, '2006', 0),
(3, 2, 4, '2007', 1),
(4, 2, 4, '2008', 0),
(1, 3, 4, 'HyperText Transfer Protocol', 1),
(2, 3, 4, 'High Transfer Text Protocol', 0),
(3, 3, 4, 'Hyper Terminal Transfer Process', 0),
(4, 3, 4, 'Home Tool Text Processor', 0);

create table token(
idToken int auto_increment,
fkUsuario int,
primary key(idToken, fkUsuario),
constraint fkUsuario_token foreign key (fkUsuario) references usuario(idUsuario) on delete cascade,
token varchar(150),
dthr datetime default now()
);

insert into gostei values (3, 3, 1);
truncate table gostei;

create table gostei(
fkUsuario int,
fkQuiz int,
gostado tinyint,
primary key (fkUsuario, fkQuiz),
constraint fkUsuario_gostei foreign key (fkUsuario) references usuario(idUsuario),
constraint fkQuiz_gostei foreign key (fkQuiz) references quiz(idQuiz)
);