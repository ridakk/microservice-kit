'use strict';

const _ = require('lodash');
const fs = require('fs');
const uuid = require('uuid');
const debug = require('debug')('microservice-kit:microservicekit');
const Chance = require('chance');

const AmqpKit = require('./amqpkit');
const ShutdownKit = require('./shutdownkit');


class MicroserviceKit {
    constructor(opt_options) {
        this.options_ = _.assign({}, this.defaults, opt_options || {});
        this.id = new Chance().first().toLowerCase() + '-' + uuid.v4().split('-')[0];
        this.amqpKit = null;
        this.shutdownKit = ShutdownKit;

        if (_.isFunction(this.options_.shutdown.logger))
            this.shutdownKit.setLogger(this.options_.shutdown.logger);
    }


    init() {
        if (!this.options_.amqp)
            return Promise.resolve();

        const amqpOptions = _.assign({}, this.options_.amqp, {id: this.getName()});
        this.amqpKit = new AmqpKit(amqpOptions);
        return this.amqpKit.init();
    }


    getName() {
        return this.options_.type + '-' +  this.id;
    }
}


MicroserviceKit.prototype.defaults = {
    type: 'microservice',
    amqp: {},
    shutdown: {
        logger: null
    }
};


module.exports = MicroserviceKit;
