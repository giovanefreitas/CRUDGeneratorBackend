import { ObjectId } from "mongodb";

export default (mongoose) => {
  let schema = mongoose.Schema(
    {
      name: {
        //Nome da classe
        type: String,
        required: true,
        validate: (value) => {
          return value && value.length > 0;
        },
      },
      project_id: {
        //Referência ao projeto
        type: ObjectId,
        required: true,
      },
      label: String, //Descrição usada em títulos e labels
      dbTable: String, //Nome da databela onde a entidade será persistida
      dbSchema: String, //Nome do schema onde a tabela existe
      properties: [
        {
          primaryKey: Boolean, //Indica se este campo compõem a chave primária
          name: String, //Nome da propridade, usado para declarar o field na classe
          description: String, //Descrição usada em títulos e labels
          default: String, //usado para indicar se um atributo padrão de um elemento composto deve ser usado ou não
          options: String, //lista de valores padrões para radio, checkbox e select
          hidden: String, //Indica se o componente deve ficar oculto no sistema gerado
          dbColumn: String, //Nome da coluna onde será salvo
          referencedEntity: String, //Nome da entidade referenciada em um relacionamento
          referencedDescribeColumn: String, //Nome da coluna que será usada como descritor em um autocomplete
        },
      ],
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Entity = mongoose.model("entity", schema);
  return Entity;
};
