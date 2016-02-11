/* globals describe:true, it:true, beforeEach:true */
"use strict";

const assert = require('chai').assert;
const models = require('../../models');

describe("integration: user model", function(){

	beforeEach(function(done){
        const user = new models.User({
           firstName:"first",
           lastName:"last",
           userName:"test",
           password:"test1234",
        });
        
        Promise.all([
        	models.User.remove({}),
        	models.Application.remove({})
        	])
            .then(() => {
                done(null);              
            })
            .catch(done);
    });

    it("populate application from user", function(done){
    	const application = models.Application({
    		name: "test app",
    		description: "test app",
    	});

    	const user = new models.User({
    		firstName:"first",
    		lastName:"last",
    		userName:"username",
    		password:"test1234",
    	});

    	application.save()
    		.then(app => {
    			user.apps.push({app:app._id});
    			return user.save();
    		})
    		.then(user => {
    			return models.User
    				.findOne({_id:user._id})
    				.populate('apps.app')
    				.exec();
    		})
    		.then(popUser => {
    			assert.equal("test app", popUser.apps[0].app.name);
    			done();
    		})
    		.catch(done);
    });

});