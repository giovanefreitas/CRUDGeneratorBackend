let FieldSchema = new mongoose.Schema({
  property: String, //ID da propriedade na entidade
  type: String, //Tipo de dado do atributo
  widgetType: String, //Tipo de input usado na interface do usuário
  label: String, //exibição na tela do sistema gerado
  cols: String, //Número de colunas que serão utilizadas em uma grade de 12 colunas
  placeholder: String, //dica de tela exibida no sistema gerado
  tagname: String, //tag html a ser usada
  textalign: String, //css de alinhamento
  fields: [FieldSchema], //sub componentes
  active: String, //usado para indicar se um atributo padrão de um elemento composto deve ser usado ou não
  options: String, //lista de valores padrões para radio, checkbox e select
  hidden: String, //Indica se o componente deve ficar oculto no sistema gerado
  subheader: String, //descrição adicional do campo, exibida no sistema gerado
  column: String, //Nome da coluna onde será salvo
  referencedEntity: String, //Nome da entidade referenciada em um relacionamento
  referencedProperty: String, //Nome da entidade referenciada em um relacionamento
});

module.exports = mongoose.model("Email", emailSchema);

export default (mongoose) => {
  var screenSchema = mongoose.Schema(
    {
      name: String, //Nome interno da tela (usado em variáveis)
      title: String, //exibição na tela do sistema gerado
      subtitle: String, //descrição adicional da tela, exibida no sistema gerado
      label_menu: String, //nome exibido nos menus da aplicação
      fields: [FieldSchema], //sub componentes
      referencedEntity: String, //Nome da entidade manipulada pela tela
    },
    { timestamps: true }
  );

  screenSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Screen = mongoose.model("screen", screenSchema);
  return Screen;
};
