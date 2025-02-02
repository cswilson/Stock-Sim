import numeral from "numeral";

export class InvestmentSummary {
    amountInvested: number;
    finalValue: number;
    dividendIncome: number;
    capitalAppreciation: number;
    netGain: number;
    percentGain: number;

    constructor(amountInvested: number, finalValue: number, dividendIncome: number) {
        this.amountInvested = amountInvested;
        this.finalValue = finalValue;
        this.dividendIncome = dividendIncome;
        this.amountInvested = amountInvested;
        this.netGain = finalValue - amountInvested;
        this.capitalAppreciation = this.netGain - dividendIncome;
        this.percentGain = ((finalValue / amountInvested) * 100) - 100;
    }

    toDisplay(): InvestmentSummaryDisplay {
        return new InvestmentSummaryDisplay(this);
    }
}

export class InvestmentSummaryDisplay {
    amountInvested: string;
    finalValue: string;
    dividendIncome: string;
    capitalAppreciation: string;
    netGain: string;
    percentGain: string;
    outputColor: string;

    constructor(investmentSummary: InvestmentSummary) {
        this.amountInvested = numeral(investmentSummary.amountInvested).format('0,0.00');
        this.capitalAppreciation = numeral(investmentSummary.capitalAppreciation).format('0,0.00');
        this.finalValue = numeral(investmentSummary.finalValue.toFixed(2)).format('0,0.00');
        this.dividendIncome = numeral(investmentSummary.dividendIncome).format('0,0.00');
        this.netGain = numeral(investmentSummary.netGain.toFixed(2)).format('0,0.00');
        this.percentGain = numeral(investmentSummary.percentGain.toFixed(2)).format('0,0.00');

        if (investmentSummary.netGain >= 0) {
            this.outputColor = "success";
        } else {
            this.outputColor = "fail";
        }
    }

    public buildOutputStringArray(): string[] {
        return [
            `Total Profit: $${this.netGain}`,
            `Percent Gain: ${this.percentGain}%`,
            `Dividend Income: $${this.dividendIncome}`,
            `Capital Appreciation: $${this.capitalAppreciation}`
        ];
    }

}
