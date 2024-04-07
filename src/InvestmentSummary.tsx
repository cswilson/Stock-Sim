import numeral from "numeral";

interface InvestmentSummary {
    amountInvested: string,
    finalValue: string,
    netGain: string,
    percentGain: string,
    outputColor: string
}

export const buildInvestmentSummary = (amountInvested: number, finalValue: number) => {
    const netGain = finalValue - amountInvested;
    const percentageGain = ((finalValue / amountInvested) * 100) - 100;

    const formattedInvestment = numeral(amountInvested).format('0,0.00');
    const formattedFinalValue = numeral(finalValue.toFixed(2)).format('0,0.00');
    const formattedNetGain = numeral(netGain.toFixed(2)).format('0,0.00');
    const formattedPercentageGain = numeral(percentageGain.toFixed(2)).format('0,0.00');

    let outputColor;
    if (netGain >= 0) {
        outputColor = "success";
    } else {
        outputColor = "fail";
    }

    const investmentSummary: InvestmentSummary = {
        amountInvested: formattedInvestment,
        finalValue: formattedFinalValue,
        netGain: formattedNetGain,
        percentGain: formattedPercentageGain,
        outputColor: outputColor
    };

    return investmentSummary;
}