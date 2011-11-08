from setuptools import setup, find_packages

setup(
    name='jquery-openid',
    version='0.1',
    description="Application for selecting openID authentication account based on jQuery Openid Realselector with small improvements",
    long_description=open('README').read(),
    author='ramusus',
    author_email='ramusus@gmail.com',
    url='https://github.com/ramusus/jquery_openid',
    download_url='https://github.com/ramusus/jquery_openid/downloads',
    license='BSD',
    packages=None,
    include_package_data=True,
    zip_safe=False, # because we're including media that Django needs
    classifiers=[
        'Development Status :: 4 - Beta',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Python Modules',
    ],
)
