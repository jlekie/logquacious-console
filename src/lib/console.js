import _ from 'lodash';

import { Channel } from 'logquacious';

export default class ConsoleChannel extends Channel {
    static channelType = 'console';
    
    constructor(logger, props) {
        super(logger, props);
        
        if (!this.stdout) { this.stdout = process.stdout }
        if (!this.stderr) { this.stderr = process.stderr }
        if (!this.renderer) { this.renderer = defaultRenderer }
        
        let { outputTemplate } = this;
        
        if (outputTemplate) {
            this.compiledOutputTemplate = _.template(outputTemplate);
        }
    }
    
    async logAsync(record) {
        let { renderer, stdout, stderr } = this;
        let { level } = record;
        
        switch (level) {
            case 'error':
                stderr.write(`${renderer.call(this, record)}\n`);
                break;
            default:
                stdout.write(`${renderer.call(this, record)}\n`);
                break;
        }
    }
}

function defaultRenderer(record) {
    let { compiledOutputTemplate } = this;
    
    if (compiledOutputTemplate) {
        return compiledOutputTemplate(record);
    }
    else {
        let { message, level, logger } = record;
        
        if (logger) {
            return `[${logger}] ${level}: ${message}`;
        }
        else {
            return `${level}: ${message}`;
        }
    }
}