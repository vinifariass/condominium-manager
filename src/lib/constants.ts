export const FINANCIAL_FILTER_OPTIONS = {
    types: ["Receita", "Despesa"],
    categories: {
        receita: [
            "Taxa de Condomínio",
            "Fundo de Reserva",
            "Multas",
            "Aluguel de Espaços",
            "Juros",
            "Outras Receitas"
        ],
        despesa: [
            "Manutenção",
            "Limpeza",
            "Segurança",
            "Energia Elétrica",
            "Água",
            "Gás",
            "Internet",
            "Telefone",
            "Seguros",
            "Impostos",
            "Salários",
            "Benefícios",
            "Materiais",
            "Outras Despesas"
        ]
    },
    status: ["Pendente", "Pago", "Atrasado", "Cancelado"],
    paymentMethods: [
        "Dinheiro",
        "PIX",
        "Cartão de Crédito",
        "Cartão de Débito",
        "Transferência Bancária",
        "Boleto",
        "Cheque"
    ]
};
