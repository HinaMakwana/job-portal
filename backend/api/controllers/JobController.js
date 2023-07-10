/**
 * JobController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   * @description post job for users
   * @route (POST job/post)
   */
  post: async (req,res) => {
    const userId = req.userData.userData
    try {
        await sails.helpers.commonFun(userId);
        let {title, company,workplaceType,jobLocation,jobType} = req.body
        
    } catch (error) {
        
    }
  },
  /**
   * @description update job post
   * @route (PATCH job/update)
   */
  updateJob: async (req,res) => {


  },
  /**
   * @description delete job post
   * @route (DELETE job/delete)
   */
  deleteJob: async (req,res) => {

  },
  /**
   * @description list all posted job
   * @route (GET job)
   */
  listAllJob: async (req,res) => {

  },
  /**
   * @description list all job of particular user
   * @route (GET job/list)
   */
  listJob: async (req,res) => {

  }
};

