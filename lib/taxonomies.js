'use strict';
/**
 * @module WP
 * @submodule TaxonomiesRequest
 * @beta
 */
var CollectionRequest = require( './shared/collection-request' );
var extend = require( 'node.extend' );
var inherit = require( 'util' ).inherits;
var parameters = require( './mixins/parameters' );
var pick = require( 'lodash' ).pick;

/**
 * TaxonomiesRequest extends CollectionRequest to handle the /taxonomies API endpoint
 *
 * @class TaxonomiesRequest
 * @constructor
 * @extends CollectionRequest
 * @param {Object} options A hash of options for the TaxonomiesRequest instance
 * @param {String} options.endpoint The endpoint URI for the invoking WP instance
 * @param {String} [options.username] A username for authenticating API requests
 * @param {String} [options.password] A password for authenticating API requests
 */
function TaxonomiesRequest( options ) {
	/**
	 * Configuration options for the request such as the endpoint for the invoking WP instance
	 * @property _options
	 * @type Object
	 * @private
	 * @default {}
	 */
	this._options = options || {};

	/**
	 * A hash of filter values to parse into the final request URI
	 * @property _filters
	 * @type Object
	 * @private
	 * @default {}
	 */
	this._filters = {};

	/**
	 * A hash of non-filter query parameters
	 *
	 * @property _params
	 * @type Object
	 * @private
	 * @default {}
	 */
	this._params = {};

	/**
	 * A hash of values to assemble into the API request path
	 *
	 * Default to requesting the taxonomies "collection" (dictionary of publicly-
	 * registered taxonomies) if no other collection is specified
	 *
	 * @property _path
	 * @type Object
	 * @private
	 * @default {}
	 */
	this._path = { collection: 'taxonomies' };

	/**
	 * The URL template that will be used to assemble endpoint paths
	 *
	 * There is no path validation for taxonomies requests: terms can be numeric
	 * (categories) or strings (tags), and the list of registered collections is
	 * not fixed (it can be augmented or modified through plugin and theme behavior).
	 *
	 * @property _template
	 * @type String
	 * @private
	 * @default '(:collection)(/:term)'
	 */
	this._template = '(:collection)(/:term)';

	/**
	 * @property _supportedMethods
	 * @type Array
	 * @private
	 * @default [ 'head', 'get' ]
	 */
	this._supportedMethods = [ 'head', 'get' ];

	// Default all .taxonomies() requests to assume a query against the WP API v2 endpoints
	this.namespace( 'wp/v2' );
}

// TaxonomiesRequest extends CollectionRequest
inherit( TaxonomiesRequest, CollectionRequest );

/**
 * Specify the name of the taxonomy collection to query
 *
 * The collections will not be a strict match to defined taxonomies: *e.g.*, to
 * get the list of terms for the taxonomy "category,"  you must specify the
 * collection name "categories" (similarly, specify "tags" to get a list of terms
 * for the "post_tag" taxonomy).
 *
 * To get the dictionary of all available taxonomies, specify the collection
 * "taxonomy" (slight misnomer: this case will return an object, not the array
 * that would usually be expected with a "collection" request).
 *
 * @method collection
 * @chainable
 * @param {String} taxonomyCollection The name of the taxonomy collection to query
 * @return {TaxonomiesRequest} The TaxonomiesRequest instance (for chaining)
 */
TaxonomiesRequest.prototype.collection = function( taxonomyCollection ) {
	this._path.collection = taxonomyCollection;

	return this;
};

/**
 * Specify a taxonomy term to request
 *
 * @method term
 * @chainable
 * @param {String} term The ID or slug of the term to request
 * @return {TaxonomiesRequest} The TaxonomiesRequest instance (for chaining)
 */
TaxonomiesRequest.prototype.term = function( term ) {
	this._path.term = term;

	return this;
};

extend( TaxonomiesRequest.prototype, pick( parameters, [
	'parent',
	'forPost'
] ) );

module.exports = TaxonomiesRequest;
