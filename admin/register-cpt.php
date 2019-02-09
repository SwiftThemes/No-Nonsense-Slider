<?php
function swift_custom_post_slider() {
	$labels = array(
		'name'               => _x( 'Sliders', 'post type general name' ),
		'singular_name'      => _x( 'Slider', 'post type singular name' ),
		'add_new'            => _x( 'Add New', 'slider' ),
		'add_new_item'       => __( 'Add New Slider' ),
		'edit_item'          => __( 'Edit Slider' ),
		'new_item'           => __( 'New Slider' ),
		'all_items'          => __( 'All Sliders' ),
		'view_item'          => __( 'View Slider' ),
		'search_items'       => __( 'Search Sliders' ),
		'not_found'          => __( 'No sliders found' ),
		'not_found_in_trash' => __( 'No sliders found in the Trash' ),
		'parent_item_colon'  => '',
		'menu_name'          => 'Sliders'
	);
	$args   = array(
		'labels'              => $labels,
		'description'         => 'Holds our slider and their slides',
		'public'              => true,
		'menu_position'       => 5,
		'supports'            => array( 'title' ),
		'has_archive'         => false,
		'publicly_queryable'  => false,
		'exclude_from_search' => true,
		'show_in_nav_menus'   => false,
		'publicly_queryable'  => false,
		'query_var'           => false

	);
	register_post_type( 'slider', $args );
}

add_action( 'init', 'swift_custom_post_slider' );