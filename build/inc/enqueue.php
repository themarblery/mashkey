<?php

/**
 * Enqueue scripts and styles.
 */
function mk_scripts() {
	wp_enqueue_style( 'mashkey-style', get_template_directory_uri() . '/css/main.css' );

	wp_enqueue_script( 'mashkey-head-js', get_template_directory_uri() . '/js/head.js', array(), '', false );

	wp_enqueue_script( 'mashkey-main-js', get_template_directory_uri() . '/js/main.js', array(), '', true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'mk_scripts' );
