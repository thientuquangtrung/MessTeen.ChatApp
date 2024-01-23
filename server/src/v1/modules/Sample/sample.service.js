class SampleService {
    static sampleServiceFunc = async (test) => {
        // CRUD with database
        const data = `Hello from sample service ${test.foo}`;

        return {
            data,
        };
    };
}

module.exports = SampleService;
