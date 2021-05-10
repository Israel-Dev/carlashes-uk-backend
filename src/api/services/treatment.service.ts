import TreatmentModel from '../models/treatment.model'

class TreatmentService {
    async getAllTreatments() {
        const treatments = await TreatmentModel.find({})
        return treatments
    }

    async getOneTreatmentById(id: string) {
        try {
            const treatment = await TreatmentModel.findById(id).exec()
            return treatment
        } catch(e) {
            console.error(e)
        }
    }

    async getOneTreatment(treatmentRef: string) {
        try {
            const treatment = await TreatmentModel.findOne({ref: treatmentRef}).exec()
            return treatment
        } catch(e) {
            console.error(e)
        }
    }
}

export default new TreatmentService()