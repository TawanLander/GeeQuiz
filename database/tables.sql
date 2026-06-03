create database site;
use site;

create table usuario(
idUsuario int primary key auto_increment,
nome varchar(60) not null,
email varchar(60) not null,
identidade varchar(20) not null,
dtNascimento date not null,
senha varchar(30) not null,
cargo char(1) not null
);

create table quiz(
idQuiz int primary key auto_increment,
titulo varchar(300) not null,
genero varchar(20) not null,
tipo varchar(20) not null,
imagem varchar(10000) not null,
fkUsuario int,
constraint fkUsuario_quiz foreign key (fkUsuario) references usuario(idUsuario) on delete cascade
);

create table quizes_completos(
id int auto_increment,
dthr datetime default now() not null,
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
selecionado tinyint not null,
constraint pkQuintupla_acertos primary key (fkQuizesCompletos, fkUsuario, fkQuiz, fkPerguntas, fkOpcoes),
constraint fkQuizesCompletos_acertos foreign key (fkQuizesCompletos, fkUsuario, fkQuiz) references quizes_completos(id, fkUsuario, fkQuiz) on delete cascade,
constraint fkPerguntas_acertos foreign key (fkOpcoes, fkPerguntas) references opcoes(id, fkPerguntas) on delete cascade
);

create table perguntas(
id int,
fkQuiz int,
constraint pkDupla_perguntas primary key (id, fkQuiz),
constraint fkQuiz_perguntas foreign key (fkQuiz) references quiz(idQuiz) on delete cascade,
titulo varchar(300) not null,
imagem varchar(10000) not null,
tipo char(1) not null
);

create table opcoes(
id int,
fkPerguntas int,
fkQuiz int,
constraint pkTripla_opcoes primary key (id, fkPerguntas, fkQuiz),
constraint fkPerguntas_opcoes foreign key (fkPerguntas, fkQuiz) references perguntas(id, fkQuiz) on delete cascade,
titulo varchar(300) not null,
tipo tinyint not null
);

create table token(
idToken int auto_increment,
fkUsuario int,
primary key(idToken, fkUsuario),
constraint fkUsuario_token foreign key (fkUsuario) references usuario(idUsuario) on delete cascade,
token varchar(150) not null,
dthr datetime default now() not null
);

create table gostei(
fkUsuario int,
fkQuiz int,
gostado tinyint not null,
primary key (fkUsuario, fkQuiz),
constraint fkUsuario_gostei foreign key (fkUsuario) references usuario(idUsuario) on delete cascade,
constraint fkQuiz_gostei foreign key (fkQuiz) references quiz(idQuiz) on delete cascade
);