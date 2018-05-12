from setuptools import setup, find_packages


setup(
    name="spam-server",
    version="0.0.1",
    platforms='any',
    packages=find_packages(),
    include_package_data=True,
    install_requires=["pytest==3.5.1",],
    author="Artists formerly known as spam",
    author_email="radu@devrandom.ro",
    description="",
    entry_points={
        # 'console_scripts': [
        #     'mongo_2_es = importer.mongo:main',
        # ]
    },

    classifiers=[
    ],
)
