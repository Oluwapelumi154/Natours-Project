class Apifeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryobj = {
            ...this.queryString,
        };

        const excludedFields = ['page', 'limit', 'sort', 'fields'];
        excludedFields.forEach((el) => delete queryobj[el]);
        // ///2)ADVANCED FILTERING
        let querystr = JSON.stringify(queryobj);
        querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.query = this.query.find(JSON.parse(querystr));
        // var query = Tour.find(JSON.parse(querystr));
        return this;
    }
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split('').join('');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    limitfields() {
        if (this.queryString.fields) {
            const field = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(field);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }
    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}
module.exports = Apifeatures;