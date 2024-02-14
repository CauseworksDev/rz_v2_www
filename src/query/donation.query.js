addLgChemDonation = (campaignId,rzPoint
) => {

    return `
    UPDATE DONATION_CAMPAIGN
		SET
			LG_CHEM_DONATION_ADDITION = LG_CHEM_DONATION_ADDITION + ${rzPoint}
		WHERE
			CAMPAIGN_ID ='${campaignId}'
    ;`;
};
module.exports = {

    addLgChemDonation ,

};
