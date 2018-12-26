import app from './app';
import * as chai from 'chai';
const chaiHttp = require('chai-http');
import 'mocha';

chai.use(chaiHttp);
const expect = chai.expect;
chai.should();

describe('GET quests', () => {
    it('It should get quest', (done) => {
        chai.request(app)
            .get('/api/quest')
            .end((err, res) => {
                // expect(err).to.be.null;
                expect(res).to.have.status(200);
                res.should.be.a('object');
                done();
            });
    });
    // it('It should get quest', (done) => {
    //     chai.request(app)
    //         .get('/api/quest')
    //         .end((err, res) => {
    //             expect(err).to.be.null;
    //             expect(res).to.have.status(200);
    //             res.should.be.a('object');
    //             done();
    //         });
    // });
});
